import { Box, Button, VStack } from "@chakra-ui/react";
import PaymentMethodInstance from "./PaymentMethodInstance";

function BuyMethods({ buyMethods }) {
    return (
        <Box>
            {buyMethods.map((item) => {
                return (
                    <PaymentMethodInstance
                        payment={item}
                        key={"payment" + item.title}
                    />
                );
            })}
            <Button
                style={{ width: "270px" }}
                colorScheme={"black"}
                padding={"20px"}
            // onClick={() => setBuyIntent(false)}
            >
                Complete
            </Button>
        </Box>
    );
}

export default BuyMethods;
