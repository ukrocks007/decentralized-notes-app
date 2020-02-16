import React from "react";
import ReactDOM from "react-dom";
import IPFS from "ipfs";
import OrbitDB from "orbit-db";
import NotesFactory from './services/notesFactory';
let docstore;

class HelloMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            note: ''
        };
        this.init();
        this.changeText = this.changeText.bind(this);
        this.saveNote = this.saveNote.bind(this);
    }

    changeText(info) {
        this.setState({
            note: info.target.value
        })
    }

    async saveNote(event) {
        let op = await NotesFactory.saveNote(docstore, {
            note: this.state.note,
            createdAt: +new Date(),
            views: 0
        })
        if (!!op) {
            this.syncNotes();
            this.setState({
                note: ''
            })
        }
    }

    syncNotes() {
        NotesFactory.getAllNotes(docstore).then(notes => {
            if (notes.length > 0) {
                this.setState({
                    list: notes
                })
            }
        });
    }

    init() {
        // const OrbitDB = require('orbit-db')

        // Create IPFS instance

        // // For js-ipfs < 0.38
        const ipfsOptions = {
            EXPERIMENTAL: {
                pubsub: true
            }
        }
        IPFS.create(ipfsOptions).then(
            async (ipfs) => {
                ipfs.start();
                const orbitdb = await OrbitDB.createInstance(ipfs);
                //const db = await orbitdb.log('hello');

                docstore = await orbitdb.docstore('orbitdb.app.notes.db')
                await docstore.load();
                let value = await NotesFactory.getAllNotes(docstore);

                if (value.length) {
                    this.setState({ list: value });
                }

                docstore.events.on('replicated', (address) => {
                    db.iterator({ limit: -1 }).collect();
                })

                // Add an entry
                // const hash = await db.add('world')
                // console.log(hash)

                // // Query
                // const result = db.iterator({ limit: -1 }).collect()
                // console.log(JSON.stringify(result, null, 2))
            }
        ).catch(e => {
            console.error(e);
        });
    }
    render() {
        return (
            <div>
                React KVStore over Orbitdb over IPFS
                <div>
                    <input value={this.state.note} name="note" onChange={this.changeText}></input>
                    <input type="button" value="Save" onClick={this.saveNote}></input>
                </div>
                <div>
                    <ol>
                        {
                            this.state.list.map((item, key) =>
                                <li key={key}>{item.note}</li>
                            )
                        }
                    </ol>
                </div>
            </div>
        );
    }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<HelloMessage name="Jane" />, mountNode);