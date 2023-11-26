import { Box, styled } from '@mui/material';

const SuggestionCardBox = styled(Box)`
    width: 250px;
    height: 350px;
    border: 1px solid black;
    border-radius: 15px;
    background: white;
    color: black;
`;

export const SuggestionCard = () => (
    <SuggestionCardBox>
        card
    </SuggestionCardBox>
);
