class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input[type="text"]');
        console.log(textField)
        let text1 = textField.value
        if (text1 === "") {
            return;
        }
        console.log(text1);
        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
    
        fetch($SCRIPT_ROOT +'/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            const answer = r.answer;
            // console.log(answer.includes("marital status?"))
            if (answer.includes("marital status?")) {
                var msg21 = r.answer+`
                    <div style='display: flex; flex-wrap: wrap; justify-content: center;'>
                        <button class='marital-status-option' value='Single'>Single</button>
                        <button class='marital-status-option' value='Married'>Married</button>
                        <button class='marital-status-option' value='Unmarried'>Unmarried</button>
                        <button class='marital-status-option' value='Divorced'>Divorced</button>
                        <button class='marital-status-option' value='Widowed'>Widowed</button>
                    </div>
                `
                let msg2 = {name: "HRB", message: msg21};
                this.messages.push(msg2);
                this.updateChatText(chatbox);
                textField.value = '';
    
                // add event listener to the newly created buttons
                chatbox.querySelectorAll('.marital-status-option').forEach((button) => {
                    button.addEventListener('click', () => {
                        var value = button.value;
                        let msg1 = {name: "User", message: value};
                        this.messages.push(msg1);
                        
                        fetch($SCRIPT_ROOT +'/predict', {
                            method: 'POST',
                            body: JSON.stringify({ message: value }),
                            mode: 'cors',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                          })
                          .then(r => r.json())
                          .then(r => {
                            const answer = r.answer;
                            var msg21= answer;
                            let msg2 = {name: "HRB", message: msg21};
                            this.messages.push(msg2);
                            this.updateChatText(chatbox);
                            textField.value = '';
                          })
                          .catch((error) => {
                            console.error('Error:', error);
                            this.updateChatText(chatbox);
                            textField.value = '';
                          });
                    });
                });
            }
            
            else if (answer.includes("student?")) {
              console.log(answer.includes("student?"))
              var msg21 = r.answer + `
              <div style='display: flex; flex-wrap: wrap; justify-content: center;'>
                <div style='display: flex; flex-wrap: wrap; justify-content: center; margin-top: 5px;'>
                  <input type='checkbox' id='student-yes' name='student' value='Yes' style='margin-right: 5px;'>
                  <label for='student-yes' style='margin-right: 10px;'>Yes</label>
                  <input type='checkbox' id='student-no' name='student' value='No' style='margin-right: 5px;'>
                  <label for='student-no'>No</label>
                </div>
              </div>
              `

              let msg2 = {name: "HRB", message: msg21};
              this.messages.push(msg2);
              this.updateChatText(chatbox);
              textField.value = '';
            
              // add event listener to the newly created checkboxes
              chatbox.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                checkbox.addEventListener('click', () => {
                  var value = checkbox.value;
                  console.log(value);
                  if (value) {
                    let user1 = {name: "User", message: value};
                    this.messages.push(user1);
              
                    fetch($SCRIPT_ROOT +'/predict', {
                      method: 'POST',
                      body: JSON.stringify({ message: value }),
                      mode: 'cors',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                    })
                    .then(r => r.json())
                    .then(r => {
                      const answer = r.answer;
                      var msg21 = answer;
                      console.log(msg21);
                      let msg2 = {name: "HRB", message: msg21};
                      this.messages.push(msg2);
                      this.updateChatText(chatbox);
                      textField.value = '';
                    })
                    .catch((error) => {
                      console.error('Error:', error);
                      this.updateChatText(chatbox);
                      textField.value = '';
                    });
                  }
                });
              });
          }   
            
            
          else {
                const answer = r.answer;
                console.log(r.answer);
                var msg21= answer;
                let msg2 = {name: "HRB", message: msg21};
                this.messages.push(msg2);
                this.updateChatText(chatbox);
                textField.value = '';
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = '';
          });
    }
    

        
    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "HRB")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }}
    const chatbox = new Chatbox();
    chatbox.display();