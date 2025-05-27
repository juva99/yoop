import { Test, TestingModule } from '@nestjs/testing';
import { ManagerSignupController } from './manager-signup.controller';

describe('ManagerSignupController', () => {
  let controller: ManagerSignupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerSignupController],
    }).compile();

    controller = module.get<ManagerSignupController>(ManagerSignupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
