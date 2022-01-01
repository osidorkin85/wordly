import React, {useEffect} from "react";
import moment from 'moment'
import {C} from "../utils/const";
import Router from "next/router";

const Index: () => void = () => {
    const momentToday = moment()
    const todayDDMMYYYY = momentToday.format(C.DDMMYYYY)
    useEffect(() => {
        const {pathname} = Router

        if (pathname === '/') {
            Router.push(`/text/${todayDDMMYYYY}`)
        }
    })
    return null
}

export default Index
