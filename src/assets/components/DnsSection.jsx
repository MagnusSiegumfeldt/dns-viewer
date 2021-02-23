import axios from 'axios';
import React, { Component } from 'react'
import DnsRow from './DnsRow';
import { Table } from 'reactstrap';
import { Collapse, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
const openIcon = <FontAwesomeIcon className="dns-header-icon" icon={faAngleDown} />
const closeIcon = <FontAwesomeIcon className="dns-header-icon" icon={faAngleUp} />


export class DnsSection extends Component {
    state = {
        loading: true,
        domain: null,
        records: [
            [], [], []
        ],
        isOpen: [
            true, true, true
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

    async fetchData(domain) {
        const baseUrl = "https://dns.google/resolve?name=";
        const requestsA = [
            baseUrl + domain + "&type=1",
            baseUrl + "www." + domain + "&type=1",
            baseUrl + "shop." + domain + "&type=1",
            baseUrl + "mail." + domain + "&type=1",
            baseUrl + "webmail." + domain + "&type=1",
            baseUrl + "autodiscover." + domain + "&type=1",
            baseUrl + "lyncdiscover." + domain + "&type=1",
        ];
        const requestsMx = [
            baseUrl + domain + "&type=15"
        ];
        const requestsTxt = [
            baseUrl + domain + "&type=16"
        ];
        const requestsArr = [requestsA, requestsMx, requestsTxt]
        let promisesArr = [[], [], []];

        // Create promises
        requestsArr.forEach((requestArr, index) => {
            requestArr.forEach(req => {
                promisesArr[index].push(axios.get(req));
            });
        });


        // Read Results
        let mainLookUp = [];
        await axios.get(baseUrl + domain + "&type=1").then(response => {
            response.data.Answer.forEach(elem => {
                mainLookUp.push(elem);
            });
        });
        promisesArr.forEach((promiseArr, index) => {
            axios.all(promiseArr).then(responses => {
                let result = [];
                responses.forEach(response => {
                    if (response.data.Answer) {
                        response.data.Answer.forEach(elem => {
                            let matchingIp = false;
                            mainLookUp.forEach(mainElem => {
                                if (elem.data == mainElem.data) {
                                    matchingIp = true;
                                }
                            });
                            if (!matchingIp || elem.name == mainLookUp[0].name || elem.name == "www." + mainLookUp[0].name) {
                                result.push(elem);
                            }

                        });
                    }
                });

                this.setState(prevState => {
                    const records = [...prevState.records]
                    records[index] = result
                    return {
                        ...prevState,
                        records: records,
                    }
                });
            });
            this.setState({
                loading: false
            })

        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.domain !== prevProps.domain) {
            this.fetchData(this.props.domain)
            this.setState({
                domain: this.props.domain,
            })
        }
    }

    render() {
        return (
            <div className="dns-section">
                <div>
                    <Button className="dns-header" onClick={() => this.toggle(0)}>A-Records {this.state.isOpen[0] ? closeIcon : openIcon}</Button>
                    <Collapse isOpen={this.state.isOpen[0]}>
                        <Table>
                            <tbody>
                                {
                                    this.state.loading ? <tr><td>Loading...</td></tr> : (
                                        this.state.records[0].length == 0 ? <tr><td>No records found</td></tr> : (
                                            this.state.records[0].map((res, i) => (
                                                <DnsRow data={res} key={i} />
                                            ))
                                        )
                                    )
                                }
                            </tbody>
                        </Table>
                    </Collapse>
                </div>
                <div>
                    <Button className="dns-header" onClick={() => this.toggle(1)}>MX-Records {this.state.isOpen[1] ? closeIcon : openIcon}</Button>
                    <Collapse isOpen={this.state.isOpen[1]}>
                        <Table>
                            <tbody>
                                {
                                    this.state.loading ? <tr><td>Loading...</td></tr> : (
                                        this.state.records[1].length == 0 ? <tr><td>No records found</td></tr> : (
                                            this.state.records[1].map((res, i) => (
                                                <DnsRow data={res} key={i} />
                                            ))
                                        )
                                    )
                                }
                            </tbody>
                        </Table>
                    </Collapse>
                </div>
                <div>
                    <Button className="dns-header" onClick={() => this.toggle(2)}>TXT-Records {this.state.isOpen[2] ? closeIcon : openIcon}</Button>
                    <Collapse isOpen={this.state.isOpen[2]}>
                        <Table>
                            <tbody>
                                {
                                    this.state.loading ? <tr><td>Loading...</td></tr> : (
                                        this.state.records[2].length == 0 ? <tr><td>No records found</td></tr> : (
                                            this.state.records[2].map((res, i) => (
                                                <DnsRow data={res} key={i} />
                                            ))
                                        )
                                    )
                                }
                            </tbody>
                        </Table>
                    </Collapse>
                </div>
            </div>

        )
    }
}

export default DnsSection
