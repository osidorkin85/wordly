import React, {useEffect, useRef, useState} from "react";
import moment from 'moment'
import {C} from "../../utils/const";
import {GetStaticPaths, NextPage} from "next";
import {WordlyEditor} from "../components/wordlyEditor";
import Router, {useRouter} from "next/router";
import Link from "next/link";

const host = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://wordly-theta.vercel.app/'

// export const getStaticPaths: GetStaticPaths<{ date: string }> = async () => {
//
//     return {
//         paths: [
//             { params: { date: moment().subtract(1, 'd').format(C.DDMMYYYY) } },
//             { params: { date: moment().format(C.DDMMYYYY) } }
//         ],
//         fallback: true
//     }
// }

// @ts-ignore
export async function getServerSideProps({params}) {
    const res = await fetch(`${host}/api/text/${params.date}`)
    const data = await res.json()

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: {...data}, // will be passed to the page component as props
    }
}

// @ts-ignore
const Text: NextPage = ({text}) => {
    const router = useRouter()
    const momentToday = moment()
    const todayDDMMYYYY = momentToday.format(C.DDMMYYYY)

    const textareaRef = useRef(null)

    const currentDate = moment(router.query.date, C.DDMMYYYY)

    const [savingState, setSavingState] = useState(C.STATES.saved)

    const postText = async (text: string) => {
        return await fetch(`/api/text/${todayDDMMYYYY}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: text
        })
    }

    async function save() {
        if (savingState === C.STATES.notsaved) {
            setSavingState(C.STATES.saving)

            const res = await postText(text)

            if (res.ok) {
                setSavingState(C.STATES.saved)
            } else {
                setSavingState(C.STATES.notsaved)
            }
        }
    }

    function saveByKeys(e: React.KeyboardEvent) {
        e.preventDefault()
        e.stopPropagation()

        save()
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        const ctrlS = e.ctrlKey && (e.key === 's' || e.key === 'ы');
        if (ctrlS) {
            saveByKeys(e)
        }
    }

    function adjust(isPaste = false): void {
        const dropMoreOn = isPaste ? 1 : 30;
        if (null !== textareaRef.current) {
            const {scrollHeight, style} = textareaRef.current;
            const scrollLeft = window.scrollX;
            const scrollTop = window.scrollY + dropMoreOn;

            // @ts-ignore
            style.overflow = 'hidden';
            // @ts-ignore
            style.height = "auto";
            // @ts-ignore
            style.height = scrollHeight + dropMoreOn + 'px';

            window.scrollTo(scrollLeft, scrollTop);
        }
    }

    const isBefore = currentDate.isBefore(momentToday, 'day');
    const isToday = currentDate.isSame(momentToday, 'day');
    const tomorrow = currentDate.add(1, 'd').format(C.DDMMYYYY);
    const yesterday = currentDate.subtract(2, 'd').format(C.DDMMYYYY);

    useEffect(() => {
        adjust(true)

    })

    return <div className="grow-wrap container">
        <Link href={`/text/${yesterday}`}>
            <a className="left-caret">&lArr;</a>
        </Link>
        {isToday &&
            <WordlyEditor
                savingState={savingState}
                setSavingState={setSavingState}
                currentDate={currentDate}
                text={text}
                textareaRef={textareaRef}
                adjust={adjust}
                onKeyDown={(e) => handleKeyDown(e)}/>
        }

        {isBefore &&
            <Link href={`/text/${tomorrow}`}>
                <a className="right-caret">&rArr;</a>
            </Link>
        }

        {isBefore &&
            <div className="history-text">
                <pre className="history-text__pre">{text}</pre>
            </div>
        }
    </div>

}

export default Text
