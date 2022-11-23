
import React, { useState } from "react";
import Box from "./Box";
import Header from "./Header";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
  
function UploadPage() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('fileName', name);
        formData.append('file', file);

        setStatus('uploading...');
        console.log('uploading ');

        
        const res = await axios({
            method: 'post',
            url: 'http://localhost:5000/upload',
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        if(res.status === 200){
            setStatus(res.data.link);
            navigate('/');
        }
        navigate('/');
        
        console.log('axios : ' + res);
        return res.data

    }
    
    return(
        <div className='upload-page'>
            <Header />
            <Box style={{
                width: 700,
                wordWrap: true,
                fontSize: 25,
                fontFamily: 'Quicksand',
                textAlign: 'center',
                marginTop: 100,
                marginLeft: 360,
                }}>
                    <div>
                        <form action="/upload" onSubmit={handleSubmit}>
                            <label>Filename</label>
                            <input type="text" name="fileName" onChange={(e) => setName(e.target.value)} value={name} required/>
                            <br/><br/>
                            <label>Upload file</label>
                            <input type="file" name="file" onChange={(e) => setFile(e.target.files[0])} required/>
                            <br/><br/>
                            <input type="submit" value="Submit"/>
                        </form>     
                        {status && <h4>{status}</h4>}
                    </div>
            </Box>
        </div>
    );
}

export default UploadPage