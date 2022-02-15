import React, { Component } from 'react'
import DnsRow from './DnsRow';
import { Table } from 'reactstrap';
import { Collapse, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
const openIcon = <FontAwesomeIcon className="dns-header-icon" icon={faAngleDown} />
const closeIcon = <FontAwesomeIcon className="dns-header-icon" icon={faAngleUp} />


export class DnsRecordSection extends Component {
   
    state = {
        domain: null,
        isOpen: true
    };

    toggle = () => {
        this.setState(prevState => {
            return {
                ...prevState,
                isOpen: !prevState.isOpen,
            }
        });
    };

    render() {
        return (
                <div>
                    <Button className="dns-header" onClick={() => this.toggle()}>{ this.props.section + " " }{this.state.isOpen ? closeIcon : openIcon}</Button>
                    <Collapse isOpen={this.state.isOpen}>
                        <Table>
                            <tbody>
                                {  
                                    !this.props.loading ? 
                                        this.props.data.length > 0 ? 
                                            this.props.data.map((res, i) => (
                                                <DnsRow data={res} key={i} />
                                            )) 
                                        : <tr><td>No results...</td></tr>
                                    : <tr><td>Loading...</td></tr>
                                }
                            </tbody>
                        </Table>
                    </Collapse>
                </div>
        )
    }
}

export default DnsRecordSection
