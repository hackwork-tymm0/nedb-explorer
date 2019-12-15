
import React, { Component } from "react"
import AppBar from "@material-ui/core/AppBar"
import ToolBar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Base64 from "base-64"
import ReactJSON from "react-json-view"

export default class App extends Component {
    constructor () {
        super();

        this.state = {
            dbPicked: false,
            db: null
        };

        this.onPickFIle = this.onPickFIle.bind(this);
        this.dbToStore = this.dbToStore.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    onPickFIle (event) {
        let file = event.target.files[0];
        let fileRead = new FileReader();

        fileRead.onload = () => this.dbToStore(fileRead.result);
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

    dbToStore (fileReadResult) {
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

        this.setState({ db: db, dbPicked: true });
    }

    render () {
        return (
            <div>
                <AppBar>
                    <ToolBar>
                        <Typography variant="h6">
                            NeDB Explorer
                        </Typography>
                    </ToolBar>
                </AppBar>
                <br />
                <br />
                <br />
                <br />
                <Box>
                    <input type="file" name="file" onChange={this.onPickFIle}/>
                    <br />
                    {this.state.dbPicked ? this.state.db.map(item => this.renderItem(item)) : <Typography variant="h4"> Please, select database file </Typography>}
                </Box>
            </div>
        );
    }
}
