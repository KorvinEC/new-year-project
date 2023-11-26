import { SuggestionCard } from '@components/SuggestionCard/SuggestionCard';
import { Box, Typography, styled } from '@mui/material';

interface SuggestionListProps {
    isEdit: boolean
}

const SuggestionTitle = styled(Typography)`
    font-size: 4rem;
    text-align: center;
`;

const SuggestionContainer = styled(Box)`
    margin: 26px 26px 0;
    border-radius: 5px;
    color: white;
`;

const SuggestionCardList = styled(Box)`
    display: flex;
    justify-content: space-between;
`;

export const SuggestionList = ({ isEdit } : SuggestionListProps) => (
    <SuggestionContainer>
        <SuggestionTitle>
            Советики
        </SuggestionTitle>
        <SuggestionCardList>
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
            <SuggestionCard />
        </SuggestionCardList>
    </SuggestionContainer>
);
