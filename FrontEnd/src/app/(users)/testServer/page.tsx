"use server"
import {testAPI, testHeader} from "../../../services/main/auth-service";

export default async function Home() {
    const test = async () => {
        testHeader().then(value => {
            console.log("TEST FROM SERVER");
        }).catch(reason => {
            console.log("ERROR FROM SERVER");
            console.log(reason);
        }).finally(() => {
            console.log("FINALLY FROM SERVER");
        })
    }
    return (
        <>
            <form action={testAPI}>
                <button type="submit" >
                    CLICK HERE
                </button>
            </form>

        </>
    )
}