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
            // will replace this to eventually get file links from ledger and then will query them from ipfs 1 by 1 to make sure they exist
            // then will put the links in the table with the name 
            // only when a file is clicked the /queryFileFromIPFS endpoint will be called (it is written now) to decrypt and download
            // the file is now being downloaded in the public folder but will need to change it to either just display it or download it in another local user folder
            const res = await axios.get("/getAllFilesFromLedger", {params: { patient: JSON.stringify(foundUser)}}); 
            setTableData(res.data.files);
        })();
      }, []);
    const data1 = React.useMemo(() => tableData)
    console.log(data1)

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
                accessor: "hash",
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
            <h2 style={{fontFamily: 'Quicksand', textAlign: 'center', marginTop: 70}}>Welcome to {foundUser.firstName}'s dashboard  !</h2>
            <Box style={{
                    backgroundColor: 'transparent',
                    color: '#7e9f38',
                    minHeight: 300,
                    width: 300,
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: 'Quicksand',
                    textAlign: 'center',
                    marginLeft: 560,
                    marginTop: 100,
            }}>
            <Table columns={columns} data={data1} actionOnClick={getPatientFile}/>
            {upload}
            </Box>
        </div>
    );
}

export { OpenPatientFile };
