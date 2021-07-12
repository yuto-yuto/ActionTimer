import "mocha";

import { expect, use } from "chai";
import * as sinon from "sinon";
import sinonChai from "sinon-chai";

import { QueuedActionTimer } from "../lib/QueuedActionTimer";

describe("QueuedActionTimer", () => {
    let instance: QueuedActionTimer;
    const interval = 3000;
    let action: sinon.SinonStub;
    let fakeTimer: sinon.SinonFakeTimers;

    before(() => {
        use(sinonChai);
    });

    beforeEach(() => {
        action = sinon.stub();
        instance = new QueuedActionTimer(interval);
        instance.action = action;
        fakeTimer = sinon.useFakeTimers();
    });
    afterEach(() => {
        fakeTimer.restore();
        sinon.restore();
    });

    describe("notify/start", () => {
        it("should not call action for first call when predicate returns true but timer doesn't start", async () => {
            action.resolves();
            await instance.notify(() => true);
            expect(action).is.not.called;
        });
        it("should call action for first call when predicate returns true and timer already starts", async () => {
            action.resolves();
            instance.start();
            await instance.notify(() => true);
            expect(action).is.calledOnce;
        });
        it("should call action for first call when predicate returns true and timer starts afterwards", async () => {
            action.resolves();
            await instance.notify(() => true);
            instance.start();
            fakeTimer.tick(interval);
            expect(action).is.calledOnce;
        });
        it("should call action twice when notify is called twice and timer starts afterwards", (done) => {
            action.onFirstCall().resolves();
            action.onSecondCall().callsFake(() => done());

            instance.notify(() => true);
            instance.notify(() => true);
            instance.start();
            fakeTimer.tick(interval);
        });
        it("should call action twice when notify is called while action is executing", (done) => {
            instance.start();
            action.onFirstCall().resolves();
            // this function returns when program reaches `await this.execute()`
            instance.notify(() => true);

            action.onSecondCall().callsFake(() => done());
            instance.notify(() => true);
        });
        it("should not call action for first call when predicate returns false", async () => {
            action.resolves(0);
            await instance.notify(() => false);
            expect(action).is.not.called;
        });
    });
});
