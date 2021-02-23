import React, { Component } from 'react'
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
const copyIcon = <FontAwesomeIcon className="copyIcon" icon={faCopy} />
const linkIcon = <FontAwesomeIcon className="linkIcon" icon={faExternalLinkAlt} size="xs" />

export class DnsRow extends Component {
    state = {
        copyIcon: false,
        tooltipOpen: false
    }


    handleClick(e, url) {
        e.preventDefault();
        chrome.tabs.create({ url: url, active: false });
    }
    toggleTooltip() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    copyCodeToClipboard = (event, data) => {
        var temp = document.createElement("textarea");
        temp.value = data;
        temp.id = "temp"
        temp.style.position = "fixed";
        temp.style.height = "0";
        temp.style.overflow = "hidden";
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(document.getElementById("temp"))
        this.setState({
            copyIcon: true
        })
        setTimeout(() => {
            this.setState({
                copyIcon: false
            })
        }, 600);
    }

    render() {
        const typeDict = {
            1: "A",
            5: "CNAME",
            15: "MX",
            16: "TXT"
        }


        let { name, type, TTL, data } = this.props.data;
        name = name.replaceAll(/(^\.+|\.+$)/g, "");
        data = data.replaceAll(/(^\.+|\.+$|^\"+|\"+$)/g, "");
        let priority = data.match(/(^[0-9].*[\ ])/g)
        data = data.replaceAll(/(^[0-9].*[\ ])/g, "");
        return (
            <tr>
                <td>{name}</td>
                <td>{typeDict[type]}</td>
                <td>{TTL}</td>
                <td>
                    {
                        priority ? priority + ": " + data : data
                    }
                </td>
                <td>
                    <Button id="btn2" className={this.state.copyIcon ? "copyBtn copied" : "copyBtn"} onClick={(event) => this.copyCodeToClipboard(event, data)}>
                        {copyIcon}

                    </Button>
                    {
                        type == 1 || type == 5 || type == 15 ? (
                            <Button className="linkBtn" onClick={(e) => this.handleClick(e, "https://dnskit.dk/" + data)}>
                                {linkIcon}
                            </Button>
                        ) : null
                    }
                </td>
            </tr>
        )
    }
}

export default DnsRow


