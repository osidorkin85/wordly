import moment from "moment";
import React, {RefObject, useRef, useState} from "react";
import {C} from "../../utils/const";
import Image from "next/image";

function WordlyEditor({
                                 text,
                                 onKeyDown,
                                 textareaRef,
                                 savingState,
                                 setSavingState,
                                 adjust
                             }: {
    savingState: string,
    text: string,
    textareaRef: RefObject<HTMLTextAreaElement>,
    setSavingState: (state: string) => void,
    onKeyDown: (e: React.KeyboardEvent) => void,
    adjust: (isPaste: boolean) => void,
}) {

    function handleChange(e: React.ChangeEvent) {
        adjust(true)
        setSavingState(C.STATES.notsaved)
    }

    return <>
        <h1>Автор, жги!</h1>
        <div>
            {C.STATES.saved === savingState && <p style={{color: "green"}}>Сохранено</p>}
            {C.STATES.saving === savingState && <Image width="16" height="16"
                                                       src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                                                       alt="loading"/>}
            {C.STATES.notsaved === savingState &&
                <p style={{color: "red"}}>Изменено, но пока не сохранено (нажмите Ctrl+S чтобы сохранить)</p>}
        </div>

        <form noValidate>
            <textarea name="text" ref={textareaRef} defaultValue={text}
                      className="textarea-input"
                      onKeyDown={onKeyDown}
                      onChange={(e) => handleChange(e)}
            />
        </form>
    </>;
}

export default WordlyEditor