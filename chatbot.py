import openai
# import gradio as gr


openai.api_key='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'
# openai.api_key='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'
# openai.api_key = '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'
# openai.api_key='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'


def gpt3_completion(prompt,engine='text-davinci-003',temp=0.7,top_p=0.1,tokens=2048,freq_pen=0.0,pres_pen=0.0,stop=['HRBT:','USER:']):
    prompt=prompt.encode(encoding='ASCII',errors='ignore').decode()
    response = openai.Completion.create(
        engine=engine,
        prompt=prompt,
        temperature=temp,
        max_tokens=tokens,
        top_p=top_p,
        frequency_penalty=freq_pen,
        presence_penalty=pres_pen,
        stop=stop
    )
    text = response['choices'][0]['text'].strip()
    
    return text

def open_file(filepath):
    with open(filepath,'r',encoding='utf-8') as infile:
        return infile.read()
chat_history = []

def ask_chat(user_input):
    # save chat history
    chat_history.append('USER: {}\n'.format(user_input))
    # print(chat_history)
    text_block = '\n'.join(chat_history)
    prompt = open_file(r'prompt_chat.txt').replace('<<BLOCK>>',text_block)
    prompt=prompt+'\nHRBT:'
    response = gpt3_completion(prompt)
    
    # print('HRBT:', response)
    chat_history.append('HRBT: {}\n'.format(response))
    return response

# def predict(input, history=[]):
#     response = ask_chat(input)
#     history.append((input, response))
#     return history, history

# with gr.Blocks() as demo:
#     gr.Markdown("""<h1><center>GPT-3 Chatbot</center></h1>
#     """)
    
#     chatbot = gr.Chatbot()
#     state = gr.State([])

#     with gr.Row():
#         txt = gr.Textbox(show_label=False, placeholder="Enter text and press enter").style(container=False)
#     txt.submit(predict, [txt, state], [chatbot, state])
#     txt.submit(lambda :"", None, txt)
    
# demo.launch(share=True)

def main(usr_input):
    response = ask_chat(usr_input)
    return response
#The following is a conversation between USER and HRBT. HRBT is a sentient machine with the goal to help the user file their Tax. start by asking "Hey, How can I help you today?".Interact like how humans would do. Then ask the user the following details as individual questions only, that is wait for the user to give the answer to each of them and then ask the next detail: {Full Name, Phone Number, Address, SSN Number and other necessary details}.  Answer the question as truthfully as possible, and if you're unsure of the answer, say "Sorry, I don't know".
