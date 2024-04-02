import {testAPI, testHeader} from "../../../services/main/auth-service";

export default async function Home() {
    const test = async () => {
        'use server'
        testAPI().then(value => {
            console.log("TEST FROM SERVER");
        }).catch(reason => {
            console.log("ERROR FROM SERVER");
            console.log(reason);
        }).finally(() => {
            console.log("FINALLY FROM SERVER");
        })
    }
    console.log("Vooo server testing")
    return (
        <>
            <form action={test}>
                <button type="submit" >
                    CLICK HERE
                </button>
            </form>

        </>
    )
}