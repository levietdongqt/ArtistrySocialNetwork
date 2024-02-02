'use client'
import {BsSearch} from "react-icons/bs";
import {useState} from "react";

const RightSideBar = () => {
    const [articles, setArticles] = useState<number>(3);
    const [articlesNext, setArticlesNext] = useState<number>(3);
    return (
        <section className=" xl:w-full hidden lg:inline items-stretch px-6 mt-2.5 ">
            <div className="w-full sticky top-2 py-1.5 z-50">
                <div className="group w-full relative">
                    <input id='searchBox' type="text" placeholder={'search Item'} className={'outline-none peer focus:border-sky-400 focus:border bg-[#3b3b3b] w-full h-full rounded-xl py-4 pl-14 pr-4'}/>
                    <p className={'peer'}></p>
                    <label htmlFor={'searchBox'} className={'absolute top-0 left-0 h-full flex items-center justify-center p-4 text-gray-500 peer-focus:text-sky-400'}>
                        <BsSearch className={'w-5 h-5'}/>
                    </label>
                </div>
            </div>

            <div className="flex flex-col rounded-xl bg-[#16181c] my-4">
                <h3 className={'font-bold text-xl my-4 px-4'}>asdasdasdasdsss</h3>
                <div>
                    {Array.from({length:7}).slice(0,articles).map((_,i)=>(
                        <div key={i} className={'hover:bg-white/10 p-4 last:rounded-b-xl transition duration-200'}>
                            <div className={'font-bold text-lg'}>Trending Item {i + 1}</div>
                            <div className={'text-xs text-neutral-400'}>35.4</div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setArticles(articles+ 3)}
                    className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
                >
                    Show more
                </button>
            </div>
            <div className="sticky top-20 flex flex-col rounded-xl bg-[#16181c] my-4">
                <h3 className={'font-bold text-xl my-4 px-4'}>asdasdasdasdsss</h3>
                <div>
                    {Array.from({length:7}).slice(0,articlesNext).map((_,i)=>(
                        <div key={i} className={'hover:bg-white/10 p-4 last:rounded-b-xl transition duration-200'}>
                            <div className={'font-bold text-lg'}>Trending Item {i + 1}</div>
                            <div className={'text-xs text-neutral-400'}>35.4</div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setArticlesNext(articlesNext + 3)}
                    className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
                >
                    Show more
                </button>
            </div>
        </section>

    )
}

export default RightSideBar;