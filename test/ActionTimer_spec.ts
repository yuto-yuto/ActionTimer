import "mocha";

import { expect, use } from "chai";
import * as sinon from "sinon";
import sinonChai from "sinon-chai";

import { ActionTimer } from "../lib/ActionTimer";

describe("ActionTimer", () => {
    let instance: ActionTimer;
    const interval = 3000;
    let action: sinon.SinonSpy;
    let fakeTimer: sinon.SinonFakeTimers;

    before(() => {
        use(sinonChai);
    });

    beforeEach(() => {
        action = sinon.fake();
        instance = new ActionTimer(interval);
        instance.action = action;
        fakeTimer = sinon.useFakeTimers();
    });
    afterEach(() => {
        fakeTimer.restore();
        sinon.restore();
    });

    describe("notify", () => {
        it("should not call action when timer is not started and predicate returns true", () => {
            instance.notify(() => true);
            expect(action).is.not.called;
        });
        it("should not call action when timer is not started and predicate returns false", () => {
            instance.notify(() => false);
            expect(action).is.not.called;
        });
        it("should not call action when timer is started and predicate returns false", () => {
            instance.start();
            instance.notify(() => false);
            expect(action).is.not.called;
        });
        it("should call action when timer is started and predicate returns true", () => {
            instance.start();
            instance.notify(() => true);
            expect(action).is.called;
        });
    });

    describe("start", () => {
        it("should call action after interval ms", () => {
            instance.start();
            fakeTimer.tick(interval - 1);
            expect(action).is.not.called;
            fakeTimer.tick(1);
            expect(action).is.called;
        });
        it("should start timer again even if action throws an error", () => {
            action = sinon.fake.throws("action throw an error");
            instance = new ActionTimer(interval);
            instance.action = action;
            instance.start();
            fakeTimer.tick(interval);
            fakeTimer.tick(interval);
            expect(action).is.calledTwice;
        });
        it("should not call global.setTimeout twice when calling start twice", () => {
            const spy = sinon.spy(fakeTimer, "setTimeout");
            instance.start();
            instance.start();
            fakeTimer.tick(interval);
            expect(spy).to.be.calledOnce;
        });
    });

    describe("stop", () => {
        it("should call clearTimeout", () => {
            const spy = sinon.spy(fakeTimer, "clearTimeout");
            instance.start();
            instance.stop();
            expect(spy).is.called;
        });
        it("should not throw an error when timer is not started", () => {
            const result = () => { instance.stop(); };
            expect(result).to.not.throw();
        });
    });
});