import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import moment from 'moment'
import {C} from "../../utils/const";
import {NextPage} from "next";
import {useRouter} from "next/router";
import Link from "next/link";
import Image from "next/image";

const host = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://wordly-theta.vercel.app/'

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
    const textareaRef = useRef() as MutableRefObject<HTMLTextAreaElement>

    const [_text, setText] = useState(text)
    const [savingState, setSavingState] = useState(C.STATES.saved)
    const [wordsCount, setWordsCount] = useState(_text.trim().split(/[\s,.;]+/).length)

    async function save() {
        if (savingState === C.STATES.notsaved) {
            setSavingState(C.STATES.saving)

            const res = await fetch(`/api/text/${todayDDMMYYYY}`, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: textareaRef.current.value
            })

            if (res.ok) {
                setSavingState(C.STATES.saved)
            } else {
                setSavingState(C.STATES.notsaved)
            }
        }
    }

    async function saveByKeys(e: React.KeyboardEvent) {
        e.preventDefault()
        e.stopPropagation()

        await save()
    }

    async function handleKeyDown(e: React.KeyboardEvent) {
        const ctrlS = e.ctrlKey && (e.key === 's' || e.key === 'ы');
        if (ctrlS) {
            await saveByKeys(e)
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            const value = textareaRef.current!.value;
            const selectionStart = textareaRef.current!.selectionStart;
            const selectionEnd = textareaRef.current!.selectionEnd;
            textareaRef.current!.value =
                value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
            textareaRef.current!.selectionStart = selectionEnd + 2 - (selectionEnd - selectionStart);
            textareaRef.current!.selectionEnd = selectionEnd + 2 - (selectionEnd - selectionStart);
        }
    }

    function adjust(isPaste = false): void {
        const dropMoreOn = isPaste ? 0 : 30;
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

    const isBefore = moment(router.query.date, C.DDMMYYYY).isBefore(momentToday, 'day');
    const isToday = moment(router.query.date, C.DDMMYYYY).isSame(momentToday, 'day');
    const nextDay = moment(router.query.date, C.DDMMYYYY).add(1, 'd').format(C.DDMMYYYY);
    const prevDay = moment(router.query.date, C.DDMMYYYY).subtract(1, 'd').format(C.DDMMYYYY);

    useEffect(() => {
        adjust(true)
    })

    // const savingCycleInterval = setInterval(async () => {
    //     if (!isChanged) return
    //     await save()
    //     setIsChanged(false)
    // }, 10000)
    //
    // if (isBefore) {
    //     clearInterval(savingCycleInterval)
    // }

    const renderLoader = <Image width="16" height="16"
                                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                                alt="loading"/>;

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        adjust(true)
        setSavingState(C.STATES.notsaved)
        setText(e.target.value)
        updateWordsCount()
    }

    function updateWordsCount() {
        setWordsCount(_text.trim().split(/[\s,.;]+/).length)
    }

    return <div className="grow-wrap container" style={wordsCount > 1000 ? {background: "green"} : {}}>
        <Link href={`/text/${prevDay}`}>
            <a className="left-caret">&lArr;</a>
        </Link>


        {isToday && <>
            <h1>Автор, твоя задача&nbsp;&mdash; написать сегодня 1000 слов!</h1>
            <div>
                {C.STATES.saved === savingState && <p style={{color: "green"}}>Сохранено</p>}
                {C.STATES.saving === savingState && renderLoader}
                {C.STATES.notsaved === savingState &&
                    <p style={{color: "red"}}>Изменено (нажмите Ctrl+S чтобы сохранить или подождите 5 секунд)</p>}
            </div>

            <form noValidate>
                <label htmlFor="text"
                       className="textarea-input__date">
                    {moment(router.query.date, C.DDMMYYYY).format(C.DDMMYYYY)}
                </label>

                <div className="textarea-input__word-count">{wordsCount}</div>

                <textarea
                    id="text"
                    name="text"
                    ref={textareaRef}
                    defaultValue={text}
                    className="textarea-input"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                />
            </form>
        </>
        }

        {isBefore &&
            <Link href={`/text/${nextDay}`}>
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
