const { default: axios } = require('axios')

var player = require('play-sound')(opts = {})

let alarmSoundFile = 'alarm.mp3'

const notify = () => {
    console.log("schedule your appointment asap")
    player.play(alarmSoundFile, function(err){
        if (err) throw err
    })    
}

let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=43&date=07-05-2021"

const isNewSlotsAdded = async () => {
    let response = await axios.get(url)
    let centers = response.data.centers
    let centersFor18 = centers.filter(center => center.sessions[0].min_age_limit == 18)

    /** if schedules for the day has been started */
    return centersFor18.length ? true : false
}

/** in ms */
let waitTime = 1000

const check = async () => {
    while(true){
        let added = await isNewSlotsAdded()
        console.log("is new slots added:", added)
        if (added) {
            break
        } else {
            console.log(`wait for ${waitTime/1000} seconds`)
            await new Promise(r => setTimeout(r, waitTime));
        }
    }

    notify()
}

/** 
 * place an audio file with the name alarm.mp3
 * 
 * yarn install
 * 
 * for linux os
 * sudo apt install mplayer
 */
check()