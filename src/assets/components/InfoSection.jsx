import axios from 'axios';
import React, { Component } from 'react'
import { Table } from 'reactstrap';
import { Collapse, Button} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

const openIcon = <FontAwesomeIcon className="dns-header-icon" icon={faAngleDown}/>
const closeIcon = <FontAwesomeIcon className="dns-header-icon" icon={faAngleUp}/>




export class InfoSection extends Component {
    state = {
        loading:true,
        domain: null,
        data: null,
        available: false,
        isOpen: [
            true, true
        ]
    };

    toggle = (index) => {
        this.setState(prevState => {
            const isOpen = [...prevState.isOpen]
            isOpen[index] = !isOpen[index];
            return {
                ...prevState,
                isOpen: isOpen,
            }
        });
    };

    fetchData(domain) {
        
        if (domain.slice(-3) == ".dk"){ // Handle other top level domains
            domain = domain.match(/([a-zA-Z0-9]|-)+\.dk$/g)[0] // Strip subdomains
            this.setState({
                available: true
            })
            axios.get("https://whois-api.dk-hostmaster.dk/domain/" + domain, {
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                this.setState({
                    data: response.data,
                    loading: false,
                });
                
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.domain !== prevProps.domain) {
            this.setState({
                domain: this.props.domain,
            })
            this.fetchData(this.props.domain)
            
        }
    }
    
    
    render() {
        return (
            <div className="info-section">      
                {
                    this.state.available ? ( 
                        this.state.loading ? <div>Loading...</div> : (
                            <div>    
                                <div>
                                    <Button className="dns-header" onClick={() => this.toggle(0)}>Domain {this.state.isOpen[0] ? closeIcon : openIcon}</Button>
                                    <Collapse isOpen={this.state.isOpen[0]}>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td>Domain</td>
                                                    <td>{ this.state.data.domain }</td>
                                                </tr>
                                                <tr>
                                                    <td>IDN</td>
                                                    <td>{ this.state.data.domain_encoded }</td>
                                                </tr>
                                                <tr>
                                                    <td>Status</td>
                                                    <td>{ this.state.data.public_domain_status == "A" ? "Active" : "Not active" }</td>          
                                                </tr>
                                                <tr>
                                                    <td>Created</td>
                                                    <td>{ this.state.data.createddate }</td>
                                                    
                                                </tr>

                                                <tr>
                                                    <td>Paid Until</td>
                                                    <td>{ this.state.data.paiduntildate }</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Collapse>
                                </div>
                                <div>
                                    <Button className="dns-header" onClick={() => this.toggle(1)}>Registrant {this.state.isOpen[1] ? closeIcon : openIcon}</Button>
                                    <Collapse isOpen={this.state.isOpen[1]}>
                                        <Table>
                                            <tbody>
                                            {
                                                this.state.data.registrant ? (
                                                    <tr>
                                                        <td>Name</td>
                                                        <td>{ this.state.data.registrant.name }</td>
                                                    </tr>
                                                ) : <tr><td colSpan="2">Information not available</td></tr>
                                            }
                                            {
                                                this.state.data.registrant ? (
                                                    <tr>
                                                        <td>Street</td>
                                                        <td>{ this.state.data.registrant.street1 }</td>
                                                    </tr>
                                                ) : null
                                            }
                                            {
                                                this.state.data.registrant ? (
                                                    <tr>
                                                        <td>City</td>
                                                        <td>{ this.state.data.registrant.countryregionid + "-" + this.state.data.registrant.zipcode + " " + this.state.data.registrant.city }</td>
                                                    </tr>
                                                ) : null
                                            }

                                            </tbody>
                                        </Table>
                                    </Collapse>
                                </div>
                            </div>
                        )   
                    ) : (
                        <div>
                            <Button className="dns-header" onClick={() => this.toggle(0)}>Domain {this.state.isOpen[0] ? closeIcon : openIcon}</Button>
                            <Collapse isOpen={this.state.isOpen[0]}>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td>Domain</td>
                                            <td>{ this.state.domain }</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Collapse>
                        </div>
                    )       
                }  
            </div>
        )
    }
}

export default InfoSection
