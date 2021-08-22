import React from 'react';

import '../css/App.css';

import MainPage from "./MainPage";



function App() {

    return (
        <div className="row App">
            <div className="col-12">
                <header className="row">
                    <div className="col-12 text-center">
                        <h1>Blog Analisys</h1> 
                    </div>
                </header>
            </div>
            <div className="col-12"> 
                <body className="row">
                    <div  className="col-12">
                        <MainPage/>
                    </div>
                </body>
            </div>
        
        </div>
    );
}

export default App;
