import {
    Button,
    Img,
    VStack
} from "@chakra-ui/react";

function Congrats({ alldone }) {

    async function doneClicked() {
        console.log('I am here')
        alldone(true)
    };

    return (
        <VStack>
            <div style={{
                display: "contents",
                marginLeft: "auto",
                marginRight: "auto",
                position: "absolute"
            }}>
                <Img
                    src={"./art1.png"} />
                <p>Congratulations!</p> 
                <p>You just created an account! </p>
                <Button
                    style={{ width: "200px" }}
                    colorScheme="brand"
                    onClick={doneClicked}
                >
                    All done
                </Button>
            </div>
        </VStack >
    );
}

export default Congrats;