//The page displayed in place of the Sign-Out page
function SignOutPage(){
    return(
        <div>
            <div className={"m-5"}>
                <h1 className={"mb-4"}>You've been signed out!</h1>
                <h4 className={"mx-5"}>(Not really, though, because this is only a front-end mockup and thus there is no authentication integrated here yet.
                    Hopefully, we'll have an integrated login/logout page with proper authentication some point tho so stay tuned!)</h4>
            </div>
        </div>
    );
}

export default SignOutPage;