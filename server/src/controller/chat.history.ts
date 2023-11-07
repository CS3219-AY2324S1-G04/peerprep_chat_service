import { Request, Response, Router } from 'express';

export class MessageHistoryController {
  private _router;

  public constructor(router: Router) {
    this._router = router;
    this._setUpRoutes();
  }

  private _setUpRoutes() {
    this._router.get('/message-history/:roomId', (req: Request, res: Response) => {
      const roomId = req.query.roomId;
      console.log(`Getting message history for room ${roomId}`);
      res.send(`Message history for room ${roomId}`);
    });
  }
}
