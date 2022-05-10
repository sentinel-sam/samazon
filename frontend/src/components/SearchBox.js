import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBox(props) {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        // props.history.push(`/search/name/${name}`);
        navigate(`/search/name/${name}`)
    };

    return (
        <form className="search" onSubmit={submitHandler}>
            <div className="row">
                <input type="text" name="q" id="q" onChange={(e) => setName(e.target.value)} />
                <button className="primary" type="submit">
                    <i className="fa fa-search"></i>
                </button>
            </div>
        </form>
    );
}