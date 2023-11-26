import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
    Backdrop, Box, CardActionArea, Collapse, IconButton,
} from '@mui/material';
import { useState } from 'react';
import { ArrowDropDown } from '@mui/icons-material';
import styled from '@emotion/styled';

export interface CardProps {
    title: string
    description: string
    url: string
    subtitle: string
}

const CardImage = styled.img`
    object-fit: contain
`;

export const NominationCard = (props: CardProps) => {
    const {
        title, description, url, subtitle,
    } = props;

    const [expand, setExpand] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    return (
        <>
            <Card sx={{ maxWidth: 350, minWidth: 350, minHeight: 550 }}>
                <CardActionArea>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {title}
                        </Typography>
                        <IconButton onClick={() => setExpand(!expand)}>
                            <ArrowDropDown />
                        </IconButton>
                    </Box>
                    <CardMedia
                        onClick={() => setOpenBackdrop(true)}
                        component="img"
                        height="350px"
                        image={url}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {subtitle}
                        </Typography>

                        {!expand && (
                            <Typography
                                sx={{
                                    width: '100%',
                                    paddingTop: '10px',
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    height: '100%',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 3,
                                }}
                                variant="body2"
                                color="text.secondary"
                            >
                                {description}
                            </Typography>
                        )}

                        <Collapse in={expand}>
                            <Typography
                                sx={{
                                    width: '100%',
                                    paddingTop: '10px',
                                }}
                                variant="body2"
                                color="text.secondary"
                            >
                                {description}
                            </Typography>
                        </Collapse>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={() => setOpenBackdrop(false)}
            >
                <Box sx={{
                    width: '100%',
                    height: '100%',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                    <CardImage src={url} height="80%" />
                </Box>
            </Backdrop>
        </>
    );
};
