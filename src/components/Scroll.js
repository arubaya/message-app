import React from 'react'

class Scroll extends React.Component {
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ block: "end" });
      }
      
    componentDidMount() {
        this.scrollToBottom();
      }
      
      componentDidUpdate() {
        this.scrollToBottom();
      }


    render() {
        return (
            <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
            </div>
        )
    }

}

export default Scroll
