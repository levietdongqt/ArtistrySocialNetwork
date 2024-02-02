import React, {useEffect, useRef, useState} from 'react';
import {AiOutlineClose, AiOutlineGif} from "react-icons/ai";
import {BsEmojiSmile, BsImage} from "react-icons/bs";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const PostNews = () => {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>('');
    const [input,  setInput] = useState<string | null>('');
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiRef = useRef<HTMLDivElement>(null);

    const addImageToPost = (e : any) =>{
        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) =>{
            setSelectedFile(readerEvent?.target?.result as string);
        }
    }
    const adjustTextAreaHeight = () => {
        const textArea = document.getElementById('yourTextAreaId');
        if (textArea) {
            textArea.style.height = 'auto';
            textArea.style.height = textArea.scrollHeight + 'px';
        }
    };
    const addEmoji = (e : any) =>{
        let sym = e.unified.split("-");
        let arrays: number[] = [];
        sym.forEach((item: number) => arrays.push("0x" + item as any));
        let emoji = String.fromCodePoint(...arrays);
        setInput(input + emoji);
    }
    const handleClickOutside = (event : MouseEvent) => {
        if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {

            setShowEmoji(false);
        }
    };
    //Post
    const sendPost = async () =>{
        if(loading)
            return;

        setLoading(false);
    }
    useEffect(() => {
        adjustTextAreaHeight();
    }, [input]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className={'flex flex-col w-full h-full '}>
                      <textarea
                          id="yourTextAreaId"
                          placeholder={'hello'}
                          value={input as string}
                          onChange={(e) => setInput(e.target.value)}
                          maxLength={280}
                          className={'placeholder:text-gray-600 w-full text-xl bg-transparent outline-none border-none resize-none'}
                          style={{ minHeight: '40px', maxHeight: '200px', overflowY: 'hidden' }}
                      />
            <div className={'mt-5'}>
                {
                    selectedFile && (
                        <div className={'relative mb-4'}>
                            <div
                                className={'absolute w-8 h-8 bg-[#15181c] hover:[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer'}
                                onClick={() => setSelectedFile(null)}>
                                <AiOutlineClose className={'text-white h-5'}/>
                            </div>
                            <img src={selectedFile} alt="haha"
                                 className={'rounded-2xl max-h-80 object-contain'}/>
                        </div>
                    )
                }
            </div>

            <div className={'w-full justify-between items-center flex'}>
                <div>
                    {
                        !loading && (
                            <div className={'flex justify-between items-center'}>
                                <div className={'flex gap-4 text-[20px] text-[#1d9bf0]'}>
                                    <label htmlFor="file">
                                        <BsImage className={'cursor-pointer'}/>
                                    </label>
                                    <input type="file" id={'file'} hidden={true} onChange={addImageToPost}/>
                                    <div className={'border-[#1d9bf0] border rounded h-[18px] text-[16px] grid place-items-center'}>
                                        <AiOutlineGif/>
                                    </div>
                                    <BsEmojiSmile className={'cursor-pointer'} onClick={() => setShowEmoji(!showEmoji)}/>

                                </div>
                            </div>
                        )
                    }
                    {
                        showEmoji && (
                            <div ref={emojiRef}  className={'absolute mt-[10px] ml-[40px] max-w-[320px] rounded-[20px]'}>
                                <Picker onEmojiSelect={addEmoji} data={data} theme={'dark'} onClickOutside={() => close}  />
                            </div>
                        )
                    }
                </div>

                <div className={'w-full max-w-[100px]'}>
                    <button
                        disabled={!input && !input?.trim()}
                        onClick={sendPost}
                        className={'rounded-full bg-blue-400 px-4 py-2 w-full text-lg text-center hover:bg-opacity-70 transition duration-200 font-bold disabled:opacity-40'}>
                        Tweet
                    </button>
                </div>
            </div>
        </div>
    )
};

export default PostNews;