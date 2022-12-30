import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import Box from './Box.js';
import Header from './Header.js';
import { CircularProgress} from '@mui/material';

function UploadPage() {
    const { register, handleSubmit } = useForm();
    const [state, setState ] = useState([]);
    const [buffer, setBuffer] = useState(false);
    const [clicked,setClicked]= useState(false);

    useEffect(() => {   
        if (!clicked) return;
         getLink()
    },[state]);

    const getLink = async () => {
        const res = await fetch("/getlink", {method: 'GET'}).then((res) => res.json());
        if(res.link) {
            setState(res.link)
            console.log(state);
            setBuffer(false);
            setClicked(false);
        } 
        else if(clicked) {
            setBuffer(true);
        } else {
            setState(['No links']);
        }
    };  

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.file[0]);
        formData.append('fileName', data.fileName)
        setClicked(true);
        setBuffer(true);
        const res = await fetch("/upload", {
            method: "POST",
            body: formData,
        }).then((res) => res.json());
        setState(res.link)
    };

    return (
        <div className="uploadpage">
            <Header />
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
                <div className="upload">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <TextField id="outlined-basic" label="File name" variant="outlined" {...register("fileName")} required/> */}
                        <input type="text" name="fileName" {...register("fileName")} placeholder='File name' required/> 
                        <input type="file" {...register("file")} style={{marginLeft:-50}} required/> 
                        <input type="submit"/>
                    </form>
                    <input type="button" value="View uploads" onClick={getLink}/> 
                    { buffer ? <CircularProgress /> : 
                    <h4> 
                        {state.map(data => (
                            <li key={data}> {data}</li>
                        ))}
                    </h4>
                    }
                </div>
            </Box>
        </div>
    );
}

export { UploadPage };