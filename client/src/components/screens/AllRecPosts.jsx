import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

function AllRecPosts() {
    const [data,setData] = useState([]);
    useEffect(() => {
        axios.get('/allpost',{
            headers: {
                "Authorization": "Bearer "+localStorage.getItem('jwt'),
            }
        })
        .then(result => {
            // console.log(result.data.posts);
            // console.log(result.data);
            setData(result.data.posts);
        })
    }, []);

    return (
        <>
            <Navbar />
            <div className="posts-container">
                <div className="post-content">
                    {
                        data.map((i, ind) => {
                            return(
                                <div key={ind} 
                                className=
                                {"post-"+(((ind+1)%3==0 && (ind+1)%2==1)?"big":"small")+
                                (((ind+1)%6===2 && (ind+1)%2===0)?" apbs":"")} 
                                style={((ind+1)%6===2 && (ind+1)%2===0)?{'--i': Math.floor((ind+1)/6) }:{}}
                                    id={"s"+Math.floor((ind+1/6))+"s"+ind}
                                >
                                    <img src={i.photo} alt="" />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            
        </>
    );
}

export default AllRecPosts;