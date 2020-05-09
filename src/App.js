import React, { Component } from 'react';
import Downshift from 'downshift';
//import ReactDOM from "react-dom";
//import axios from 'axios';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searched: [],
            districts: [],
            yourVariable: "",
            addReset: false,
        }

        this.inputOnChange = this.inputOnChange.bind(this);
        this.reset = this.reset.bind(this);
    }

    inputOnChange(event) {
        
        let str = event.target.value;
        str = str.replace(/^\s+/, '');
        this.setState({yourVariable: str});
        //this.setState({ yourVariable: event.target.value });
    }

    downshiftOnChange = (selectedDistrict) => {
        //alert(`You chose ${selectedDistrict.district}`);
        //console.log(`You chose ${selectedDistrict.district}`);
        this.setState(prevState => ({
            searched: [...prevState.searched, selectedDistrict],
        }));
        this.setState({ yourVariable: "",addReset: true });
    }

    reset() {
        //window.location.reload();
        this.setState({searched : [], addReset: false});
    }
    
    componentDidMount() {
        fetch('https://api.covid19india.org/zones.json')
        .then(result => result.json())
        .then(json => {
          this.setState({
            districts: json,
          })
        });
      }

    render() {
        let button;
        if(this.state.addReset === true) {
            button = <button className="reset" onClick={this.reset}><b>Reset</b></button>
        }
        return (
            <div className="Appgamma">
                <div className="mainapp">
                <h2 className="heading">Covid19 Zone</h2>
                <ul className="district-list">
                    {this.state.searched.map(item => 
                        <li className={item.zone} key={item.districtcode}>
                            <div>{item.district}</div> <div>:</div> <div>{item.zone}</div>
                        </li>)
                    }
                </ul>                
                <Downshift className="downshift" 
                    onChange={this.downshiftOnChange} 
                    itemToString={item => (item? item.district : '')}
                    inputValue={this.state.yourVariable}
                >
                    {({ selectedItem, 
                        getInputProps, 
                        getItemProps, 
                        highlightedIndex, 
                        isOpen, 
                        inputValue, 
                        getLabelProps
                    }) => (
                        <div>
                            <input className="downshift-input" {...getInputProps({
                                placeholder: "Search for your city here",
                                onChange: this.inputOnChange
                            })} />
                            {isOpen ? (
                                <div className="downshift-dropdown">
                                    {
                                        this.state.districts.zones
                                            .filter(item => !inputValue || item.district.toLowerCase().includes(inputValue.toLowerCase()))
                                            .slice(0, 10)
                                            .map((item, index) => (
                                                <div
                                                    className="dropdown-item"
                                                    {...getItemProps({key: index, index, item})}
                                                    style={{
                                                        backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                                                    }}>
                                                    {item.district}
                                                </div>
                                            ))
                                    }
                                </div>
                            ): null}
                        </div>
                    )}
                </Downshift>
                {button}
                </div>
            </div>
        );
    }
}

export default App;