import React, {useState, useEffect, useMemo} from 'react';
import Box from './Box.js';
import Header from './Header.js';
import { useLocation, Link } from 'react-router-dom';
// import { CircularProgress} from '@mui/material';
import axios from 'axios';
import Table from "./Table.js";

function OpenPatientFile(props) {
    const [tableData, setTableData] = useState([]);
    const params = useLocation();
    const [isPatient, setIsPatient] = useState(null);
    const foundUser = params.state.foundUser;
    const upload = <Link to='/uploadpage' state={{foundUser}}> <button className="home-button" type="button"> Upload </button> </Link> 

    useEffect(() => {
        (async () => {
            const res = await axios.get("/getAllFilesFromLedger", {params: { patient: JSON.stringify(foundUser)}}); 
            setTableData(res.data.files);
        })();
        axios.get('/isPatient').then(({data}) => {
            setIsPatient(data);
          })
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
        await axios.get('/queryFileFromIPFS',{params: {link: link, fileName: fileName, hash:rowData.hash, currentPatient: JSON.stringify(foundUser)}, responseType: 'blob' }).then(response => {
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const downloadUrl = URL.createObjectURL(blob);

            const anchor = document.createElement('a');
            anchor.href = downloadUrl;
            anchor.download = fileName; 
            anchor.type = 'application/octet-stream'; 
            document.body.appendChild(anchor);
            anchor.click();

            URL.revokeObjectURL(downloadUrl);
          }).catch((err) => {
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
                {tableData.length === 0 ? 
                    <h2 style={{fontFamily: 'Quicksand', color: "black", marginTop: 150}}> No health record available to display. </h2>
                    : <Table columns={columns} data={data1} actionOnClick={getPatientFile}/>
                }
                {isPatient? null:upload}
            </Box>
        </div>
    );
}

export { OpenPatientFile };
