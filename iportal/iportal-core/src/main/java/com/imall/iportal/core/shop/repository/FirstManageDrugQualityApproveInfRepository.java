
package com.imall.iportal.core.shop.repository;

import com.imall.iportal.core.shop.entity.*;
import com.imall.commons.base.dao.IBaseRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * (JPA持久化层)
 * @author by imall core generator
 * @version 1.0.0
 */
public interface FirstManageDrugQualityApproveInfRepository extends  IBaseRepository<FirstManageDrugQualityApproveInf, Long>,FirstManageDrugQualityApproveInfRepositoryCustom {


    /**
     * 通过首营商品审核id
     * @param id
     * @return
     */
    List<FirstManageDrugQualityApproveInf> findByFirstManageDrugQualityApproveId(Long id);
}

