import { DataStore, Responder } from './../interfaces/interfaces';
import * as PDFKit from 'pdfkit';
import * as fs from 'fs';
import * as archiver from 'archiver';
import { LearningObject } from '@cyber4all/clark-entity';
import * as request from 'request';

/**
 * The business logic for packaging learning objects' content and sending back to client;
 *
 * @author Gustavus Shaw II
 */
export class LibraryInteractor {
    /**
     * Fetches full learning object from datastore and passes them to packageObjects
     * If no learning objects returned then sends error
     *
     * @param {DataStore} dataStore
     * @param {Responder} responder
     * @param {string[]} learningObjectIDs
     * @memberof LibraryInteractor
     */
    async checkout(dataStore: DataStore, responder: Responder, learningObjectIDs: string[]) {
        let objects = await dataStore.readMultipleLearningObjects(learningObjectIDs, true);
        let learningObjects = objects.map((_learningObject) => {
            let object = JSON.parse(_learningObject);
            let learningObject = LearningObject.unserialize(_learningObject);
            return learningObject;
        });

        learningObjects.length > 0 ?
            this.packageObjects(learningObjects, responder) : responder.sendOperationError('Learning Objects not found');
    }
    /**
     * Generates PDFs for learning Objects, compresses the PDFs and uploaded files, and sends compressed file to client
     *
     * @private
     * @param {LearningObject[]} learningObjects
     * @param {Responder} responder
     * @memberof LibraryInteractor
     */
    private async packageObjects(learningObjects: LearningObject[], responder: Responder) {
        // Setup output stream and archiver
        let archive = archiver('zip', { zlib: { level: 9 } });

        // Pipe to Response;
        archive.pipe(responder.writeStream());

        // Add event handlers
        archive.on('error', (err) => {
            responder.sendOperationError(err.message);
        });

        // Iterate over Learning Objects and generate pdfs; Keep track of objects remaining
        let remainingObjects = learningObjects.length;
        for (let learningObject of learningObjects) {
            // Create new Doc and Track Stream
            let doc = new PDFKit();

            // Create array to catch Buffers
            let buffers: Buffer[] = [];

            // Add Event Handlers
            doc.on('data', (data) => {
                buffers.push(data);
            });
            doc.on('end', () => {
                let buffer: Buffer = Buffer.concat(buffers);
                archive.append(buffer, { name: `${learningObject.name}/${learningObject.name}.pdf` });
                remainingObjects--;
                remainingObjects === 0 ? archive.finalize() : 'Not finished generating pdfs for learning objects, continue';
            });

            // MetaData
            doc.info.Title = learningObject.name;
            doc.info.Author = learningObject.author['_name'];
            doc.info.Creator = 'C.L.A.R.K. | Cybersecurity Labs and Resource Knowledge-base';
            doc.info.CreationDate = new Date(+learningObject.date);
            doc.info.ModDate = new Date();

            // Cover Page
            doc.text(learningObject.name, { align: 'center' });
            doc.text(learningObject.length, { align: 'center' });
            doc.text(new Date(+learningObject.date).toLocaleDateString(
                'en-US',
                { month: 'long', day: 'numeric', year: 'numeric' }),
                { align: 'center' });
            doc.text(learningObject.author['_name'], { align: 'center' });

            doc.addPage();

            // Goals
            learningObject.goals.length > 0 ? doc.text('Goals') : 'There are no goals';
            learningObject.goals.forEach((goal) => {
                doc.text(goal.text);
            });

            // Outcomes
            learningObject.outcomes.length > 0 ? doc.text('Outcomes') : 'There are no outcomes';
            learningObject.outcomes.forEach((outcome) => {
                doc.text(outcome.text);
                // Assessments
                outcome.assessments.forEach((assessment) => {
                    doc.text(assessment.plan);
                    doc.text(assessment.text);
                });
                // Instructional Strategies
                outcome.strategies.forEach((strategy) => {
                    doc.text(strategy.instruction);
                    doc.text(strategy.text);
                });
            });

            // Content (Urls)
            learningObject.repository.urls.length > 0 ? doc.text('Content') : 'There are no URLs';
            learningObject.repository.urls.forEach((url) => {
                doc.text(url.title, 20, doc.y, { link: url.url, underline: true });
            });

            // Content (Notes)
            if (learningObject.repository.notes) {
                doc.text('Notes');
                doc.text(learningObject.repository.notes);
            }

            // Package any uploaded files with Learning Object
            for (let file of learningObject.repository.files) {
                // Get file from remote, pass archive its ReadableStream
                // Cast stream to type any to get rid of TypeScript complaints
                await archive.append((<any>request(file.url)), { name: `${learningObject.name}/${file.name}` });
            }

            // End Doc WriteStream
            doc.end();
        }
    }
}
