import axios from 'axios';
import React, { Component } from 'react'
import DnsRecordSection from './DnsRecordSection'

export class DnsSection extends Component {
    state = {
        loading: true,
        domain: null,
        records: [
            [], [], [], []
        ]
    };


    async fetchData(domain) {
        const baseUrl = "https://dns.google/resolve?name=";
        
        const requestsNS = [
            baseUrl + domain + "&type=2"
        ]

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
        const requestsArr = [requestsNS, requestsA, requestsMx, requestsTxt]
        let promisesArr = [[], [], [], []];

        // Create promises
        requestsArr.forEach((requestArr, index) => {
            requestArr.forEach(req => {
                promisesArr[index].push(axios.get(req));
            });
        });


        // Read Results
        let mainLookUp = [];
        await axios.get(baseUrl + domain + "&type=1", { timeout: 100 }).then(response => {
            response.data.Answer.forEach(elem => {
                mainLookUp.push(elem);
            });
        }).catch(err => {
            console.log(err)
        });
        promisesArr.forEach((promiseArr, index) => {
            axios.all(promiseArr, { timeout: 1000 }).then(responses => {
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
                    {
                        this.state.records.map((res, i) => (
                            <DnsRecordSection data={res} loading={this.state.loading} section={["NS-records", "A-records", "MX-records", "TXT-records"][i]} key={i} />
                        ))
                    }   
                </div>
            </div>

        )
    }
}

export default DnsSection
