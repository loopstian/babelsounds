import { Router, type IRouter } from "express";
import healthRouter from "./health";
import researchRouter from "./research";
import synthesizeVoiceRouter from "./synthesize-voice";
import createAgentRouter from "./create-agent";
import interrogateRouter from "./interrogate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(researchRouter);
router.use(synthesizeVoiceRouter);
router.use(createAgentRouter);
router.use(interrogateRouter);

export default router;
