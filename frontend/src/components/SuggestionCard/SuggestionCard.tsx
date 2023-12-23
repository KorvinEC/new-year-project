import { Box, styled } from '@mui/material';

const SuggestionCardBox = styled(Box)`
    width: 250px;
    height: 350px;
    border: 1px solid black;
    border-radius: 5px;
    background: white;
    color: black;
`;

export const SuggestionCard = () => (
    <SuggestionCardBox>
        card
    </SuggestionCardBox>
);
