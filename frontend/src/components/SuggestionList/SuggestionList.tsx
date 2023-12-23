import { SuggestionCard } from '@components/SuggestionCard/SuggestionCard';
import {
    Box, Grid, IconButton, Typography, styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { emptySuggestion, useTemplate } from '@enteties/Template/model';
import { useQuery } from 'react-query';
import { getTemplate } from '@actions/getTemplate';
import { TemplateCard } from '@components/TemplateCard/TemplateCard';
import { NominationCard } from '@components/NominationCard/NominationCard';

interface SuggestionListProps {
    isEdit: boolean
}

const SuggestionTitle = styled(Typography)`
    font-size: 4rem;
    text-align: center;
`;

const SuggestionContainer = styled(Box)`
    border-radius: 5px;
    color: white;
`;

const SuggestionCardList = styled(Box)`
    display: flex;
    justify-content: space-between;
`;

const AddContainer = styled(Box)`
    width: 350px;
    height: 600px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 5px;
`;

export const SuggestionList = ({ isEdit } : SuggestionListProps) => {
    const { isLoading, error, data } = useQuery('template', getTemplate);

    if (isLoading) return 'Loading...';

    if (error) return 'An error has occurred: ';
    const onClick = () => {
        console.log('add');
    };
    return (
        <SuggestionContainer>
            <SuggestionTitle>
                Советики
            </SuggestionTitle>
            <SuggestionCardList>
                <Box margin="16px 28px">
                    <Grid
                        container
                        direction="row"
                        spacing={3}
                    >
                        {isEdit && (
                            <Grid item spacing={2}>
                                <AddContainer>
                                    <Typography sx={{ color: 'black' }}> Добавить советик</Typography>
                                    <IconButton onClick={onClick}>
                                        <AddIcon />
                                    </IconButton>
                                </AddContainer>
                            </Grid>
                        )}
                        {data?.data?.suggestions?.map((nomination) => (
                            isEdit
                                ? (
                                    <Grid item spacing={2}>
                                        <TemplateCard
                                            key={nomination.id}
                                            title=""
                                            description={nomination.description}
                                            url={nomination.img}
                                            subtitle={nomination.subtitle}
                                        />
                                    </Grid>
                                )
                                : (
                                    <Grid item spacing={2}>
                                        <NominationCard
                                            key={nomination.id}
                                            title=""
                                            description={nomination.description}
                                            url={nomination.img}
                                            subtitle={nomination.subtitle}
                                        />
                                    </Grid>
                                )
                        ))}
                    </Grid>
                </Box>
            </SuggestionCardList>
        </SuggestionContainer>
    );
};
