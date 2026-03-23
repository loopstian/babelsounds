import { Router, type IRouter } from "express";
import healthRouter from "./health";
import researchRouter from "./research";
import synthesizeVoiceRouter from "./synthesize-voice";
import createAgentRouter from "./create-agent";

const router: IRouter = Router();

router.use(healthRouter);
router.use(researchRouter);
router.use(synthesizeVoiceRouter);
router.use(createAgentRouter);

export default router;
