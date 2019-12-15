
import React, { Component } from "react"
import AppBar from "@material-ui/core/AppBar"
import ToolBar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Base64 from "base-64"
import ReactJSON from "react-json-view"
import Button from "@material-ui/core/Button"
import DocumentTItle from "react-document-title"

export default class App extends Component {
    constructor () {
        super();

        this.state = {
            activeDB: "",
            dbPicked: false,
            file: null,
            db: null
        };

        this.onPickFIle = this.onPickFIle.bind(this);
        this.dbToStore = this.dbToStore.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    onPickFIle (file) {
        let fileRead = new FileReader();

        this.setState({ activeDB: file.name });

        fileRead.onload = () => this.dbToStore(fileRead.result, file);
        fileRead.readAsDataURL(file);
    }

    renderItem (item) {
        return (
            <div>
                <Typography> {item.id} </Typography>
                <ReactJSON src={item.data}/>
            </div>
        );
    }

    dbToStore (fileReadResult, file) {
        let strokes = Base64.decode(fileReadResult.split(",")[1]).split("\n");
        let db = [];

        for (let stroke of strokes) {
            try {
                let dbStroke = {
                    id: null,
                    data: null
                };
                let strokeJSON = JSON.parse(stroke);
    
                dbStroke.id = strokeJSON._id;
                delete strokeJSON["_id"]
                dbStroke.data = strokeJSON;
    
                db.push(dbStroke);
            } catch (e) {
            }
        }

        this.setState({ db: db, dbPicked: true, file: file});
    }

    render () {
        console.log(this.state);
        return (
            <div>
                <DocumentTItle 
                    title={`${this.state.activeDB} - NeDB Explorer`}
                />
                <AppBar>
                    <ToolBar>
                        <Typography variant="h6">
                            {this.state.activeDB} - NeDB Explorer
                        </Typography>
                    </ToolBar>
                </AppBar>
                <br />
                <br />
                <br />
                <br />
                <Box>
                    {!this.state.dbPicked ? <input type="file" name="file" onChange={(event) => this.onPickFIle(event.target.files[0])}/> : null}
                    {this.state.dbPicked ? (
                        <div>
                            <Button onClick={() => this.onPickFIle(this.state.file)}> Refresh </Button>
                            <Button color="secondary" onClick={() => this.setState({
                                                                                    activeDB: "",
                                                                                    dbPicked: false,
                                                                                    file: null,
                                                                                    db: null
                            })}> close </Button>
                        </div>
                    ) : null}
                    <br />
                    {this.state.dbPicked ? this.state.db.map(item => this.renderItem(item)) : <Typography> Please, select database file </Typography>}
                </Box>
            </div>
        );
    }
}
