import { rest } from 'msw';
import { authValues, yearTemplate } from './data';

const yearTemplateRes = yearTemplate;

export const handlers = [
    rest.post('/login', (req, res, ctx) => {
        if (req.body.email === authValues.email && req.body.password === authValues.password) {
            return res(
                ctx.json({
                    data: {
                        id: '123',
                        token: 'page_token',
                        name: 'Yura Kovalev',
                    },
                }),
                ctx.status(200),
            );
        }
        return res(
            ctx.status(400),
        );
    }),
    rest.get('/template', (_req, res, ctx) => res(
        ctx.json(yearTemplateRes),
        ctx.status(200),
    )),
    rest.post('/template', (req, res, ctx) => {
        yearTemplateRes.nominations = [...req.json];
        return res(
            ctx.json(yearTemplateRes),
            ctx.status(200),
        );
    }),
];
