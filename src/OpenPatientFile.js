import React, {useState, useEffect, useMemo} from 'react';
import Box from './Box.js';
import Header from './Header.js';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CircularProgress} from '@mui/material';
import axios from 'axios';
import Table from "./Table.js";

function OpenPatientFile(props) {
    const [tableData, setTableData] = useState([]);
    const params= useLocation();
    const foundUser = params.state.foundUser;
    let upload = <Link to='/uploadpage' state={{foundUser}}> <button className="home-button" type="button"> Upload </button> </Link> 

    useEffect(() => {
        (async () => {
            const res = await axios.get("/getAllFilesFromLedger", {params: { patient: JSON.stringify(foundUser)}}); 
            setTableData(res.data.files);
        })();
      }, []);
    const data1 = React.useMemo(() => tableData)

    const columns = useMemo( () => [
        {
            Header: 'Files',
            columns: [
            {
                Header: "File Name",
                accessor: "name",
            },
            {
                Header: "File Link",
                accessor: "link",
            },
            {
                Header: "Issuer",
                accessor: "issuer",
            },
            {
                Header: "File Hash",
                accessor: "hash"
            },
            {
                Header: "Date issued",
                accessor: "date"
            },
            ],
        },
    ],[]
    );

    const getPatientFile = async (rowData) => {
        const link = rowData.link
        const fileName = rowData.name
        await axios.get('/queryFileFromIPFS',{params: {link: link, fileName: fileName, hash:rowData.hash, currentPatient: JSON.stringify(foundUser)}}).catch((err) => {
            console.log(err)
        })
    }
  
    return (
        <div className="open-patient-file">
            <Header />
            {/* <h2 style={{fontFamily: 'Quicksand', textAlign: 'center', marginTop: 70}}>Welcome to {foundUser.firstName}'s dashboard  !</h2> */}
            <Box style={{
                    backgroundColor: 'transparent',
                    color: '#7e9f38',
                    minHeight: 300,
                    width: 600,
                    borderRadius: 10,
                    fontSize: 20,
                    fontFamily: 'Quicksand',
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 100,
            }}>
            <Table columns={columns} data={data1} actionOnClick={getPatientFile}/>
            {foundUser.identity!='patient'? upload:null}
            </Box>
        </div>
    );
}

export { OpenPatientFile };
