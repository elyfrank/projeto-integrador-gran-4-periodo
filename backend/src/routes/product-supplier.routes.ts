import {Router} from 'express';
import * as productSupplierController from '../controllers/product-supplier.controller';

const router = Router();

router.get('/product/:product/suppliers', productSupplierController.getSuppliersByProduct);
router.post('/', productSupplierController.createSupplierToProduct);
router.delete('/', productSupplierController.deteleSupplierProduct);


export default router;
