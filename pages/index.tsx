import React, {useEffect, useRef, useState} from "react";
import moment from 'moment'
import {C} from "../utils/const";
import {NextPage} from "next";
import Image from "next/image";

const Index: NextPage = () => {
    const momentToday = moment()
    const todayDDMMYYYY = momentToday.format(C.DDMMYYYY)

    const textInput = useRef<HTMLTextAreaElement>(null);

    const [currentDate, setCurrentDate] = useState(momentToday)
    const [savingState, setSavingState] = useState(C.STATES.saved)

    const [text, setText] = useState('')

    const fetchText = async (currentDate: string) => {
        const res = await fetch(`/api/text/${currentDate}`)
        const {text} = await res.json()
        setText(text)
        adjust(true)
    }

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

    useEffect(() => {
        fetchText(currentDate.format(C.DDMMYYYY))
    }, [currentDate, fetchText])

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

    function putTab(e: React.KeyboardEvent) {
        if (e.target instanceof HTMLTextAreaElement) {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            setText(text.substring(0, start) + '\t' + text.substring(end));
            return e.target.selectionStart = e.target.selectionEnd = start + 1;
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        const ctrlS = e.ctrlKey && (e.key === 's' || e.key === 'ы');
        const tab = e.key === C.TABKEY
        if (ctrlS) {
            saveByKeys(e)
        }
        if (tab) {
            console.log(e);
            putTab(e)
        }
    }

    function handleChange(e: React.ChangeEvent) {
        adjust(true)
        setSavingState(C.STATES.notsaved)
        setText(textInput?.current?.value || "")
    }

    function adjust(isPaste = false): void {
        const dropMoreOn = isPaste ? 1 : 30;
        if (null !== textInput.current) {
            const {scrollHeight, style} = textInput.current;
            const scrollLeft = window.scrollX;
            const scrollTop = window.scrollY + dropMoreOn;

            style.overflow = 'hidden';
            style.height = "auto";
            style.height = scrollHeight + dropMoreOn + 'px';

            window.scrollTo(scrollLeft, scrollTop);
        }
    }

    return <div className="grow-wrap container">
            <h1>Автор, жги!</h1>
            <div>
                {C.STATES.saved === savingState && <p style={{color: "green"}}>Сохранено</p>}
                {C.STATES.saving === savingState && <Image width="16" height="16"
                                         src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                                         alt='loading'/>}
                {C.STATES.notsaved === savingState && <p style={{color: "red"}}>Изменено, но пока не сохранено (нажмите Ctrl+S чтобы сохранить)</p>}
            </div>

            <form noValidate>
                <div className="textarea-input__date">{currentDate.format(C.DDMMYYYYhhmm)}</div>
                <textarea name="text" ref={textInput} defaultValue={text}
                      className="textarea-input"
                      onKeyDown={(e) => handleKeyDown(e)}
                      onChange={(e) => handleChange(e)}
                />
            </form>
        </div>

}

export default Index
