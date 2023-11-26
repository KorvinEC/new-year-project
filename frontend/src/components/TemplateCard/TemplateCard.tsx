import {
    Box, Button, TextField, Typography, styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { CardProps } from '@components/NominationCard/NominationCard';

const DescriptionField = styled(TextField)`
    background-color: "#ffcda2",
    
    overflow: 'auto',
`;

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const CardContainer = styled(Box)`
    width: 350px;
    min-height: 550px;
    display: flex;
    flex-direction: column;
    background: white;
    gap: 15px;
    border-radius: 5px;
    padding: 10px;
`;

const CardTitle = styled(Typography)`
  width: 100%;
  text-align: center;
  font-size: 22px; 
  font-weight: semi-bold;
`;

export const TemplateCard = ({
    title, description, url, subtitle,
}: CardProps) => {
    const [files, setFiles] = useState<File[]>([]);

    const urls = files.map((file) => URL.createObjectURL(file));
    return (
        <CardContainer>
            <CardTitle>{title}</CardTitle>
            <TextField variant="standard" label="Ваше название" defaultValue={subtitle} />
            <img src={urls?.[0] ?? url} width="100%" height="350px" alt="card" />
            <Button component="label" variant="contained" startIcon={<AddIcon />}>
                Загрузить файл
                <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const fileList = e.target.files;
                        if (fileList) {
                            const files = [...fileList];
                            setFiles(files);
                        }
                    }}
                />
            </Button>
            <DescriptionField
                defaultValue={description}
                multiline
                id="outlined-basic"
                placeholder=""
                label="Описание"
                variant="outlined"
            />
        </CardContainer>
    );
};
