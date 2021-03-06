/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Cache = require('../../utils/cache');

describe('Cache cleans up unused entries periodically', () => {
  let sandbox;
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('Should delete entry that has not been accessed in 2 weeks', () => {
    const cacheMap = new Cache();
    cacheMap.set(4, 'Four');
    clock.tick(2 * 7 * 24 * 60 * 60 * 1000 - 1);
    expect(cacheMap.size).to.equal(1);
    clock.tick(1);
    expect(cacheMap.size).to.equal(0);
  });

  it('Should reset lifetime of entry if accessed before 2 weeks', () => {
    const cacheMap = new Cache();
    cacheMap.set(4, 'four');
    clock.tick(2 * 7 * 24 * 60 * 60 * 1000 - 1);
    expect(cacheMap.size).to.equal(1);
    cacheMap.get(4);
    clock.tick(1);
    expect(cacheMap.size).to.equal(1);
  });

  it('Should delete an entry that has been accessed after expiry', () => {
    const cacheMap = new Cache();
    cacheMap.set(4, 'Four');
    cacheMap.get(4);
    clock.tick(2 * 7 * 24 * 60 * 60 * 1000);
    expect(cacheMap.size).to.equal(0);
  });
});
