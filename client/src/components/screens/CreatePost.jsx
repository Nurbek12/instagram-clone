import React, {useState} from 'react';
import Navbar from '../Navbar';
import { useHistory } from 'react-router-dom';
import AlertMes from './Alert';
import axios from 'axios';

function CreatePost() {
    const history = useHistory();
    const [mdb, setMdb] = useState(true);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");

    const PostDetails = async () => {
        // console.log(12);
        const newForm = new FormData();
        newForm.append('body', body);
        newForm.append('title', title);
        newForm.append('photo', image);
        await axios.post('/createpost', newForm, {
            headers: {
                "Content-Type":"multipart/form-data",
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            },
        })
        // await fetch('/createpost',{
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "multipart/form-data",
                
        //     },
        // })
        // .then(resp => resp.json())
        .then(data => {
            // console.log(data);
            if(data.error){
                AlertMes(data.error, "error");
            }else{
                AlertMes("Публикация успешно сохранено", "success");
                history.push('/');
            }
        }).catch(err => {
            console.error(err);
        })
    }

    const closeModal = () => {
        setMdb(false);
    }

    return (
        <>
            <Navbar />     
            <div className="createpost-modal" style={{display: (mdb?'flex':'none')}}>
                <div className="createpost-close" onClick={closeModal}>
                    <i className="fa fa-close"></i>
                </div>
                <form className="createpost-content">
                <div className="createpost-title">Создание публикации</div>
                    <input type="text" placeholder="Глава" onChange={(e)=>setTitle(e.target.value)} value={title} />
                    <input type="text" placeholder="Заголовок" onChange={(e)=>setBody(e.target.value)} value={body} />
                    <input type="file" onChange={(e)=>{setImage(e.target.files[0]);}} />
                    <input type="button" value="Создать публикации" onClick={ PostDetails } />
                </form>
            </div>
        </>
    );
}

export default CreatePost;