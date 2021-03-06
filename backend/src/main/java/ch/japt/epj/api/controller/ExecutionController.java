package ch.japt.epj.api.controller;

import ch.japt.epj.api.PaginatedExecution;
import ch.japt.epj.library.SortParameterHandler;
import ch.japt.epj.model.ExecutionModel;
import ch.japt.epj.model.QrModel;
import ch.japt.epj.model.dto.ExecutionDto;
import ch.japt.epj.model.dto.NewExecutionDto;
import io.swagger.annotations.Api;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Api(tags = "Execution API")
@RequestMapping("/api")
public class ExecutionController implements ch.japt.epj.api.ExecutionApi, PaginatedExecution {
  private final ExecutionModel executionModel;
  private final QrModel qrModel;

  public ExecutionController(@Autowired ExecutionModel executionModel, QrModel qrModel) {
    this.executionModel = executionModel;
    this.qrModel = qrModel;
  }

  @Override
  @Secured({"ROLE_TEACHER"})
  public ResponseEntity<Void> addExecution(@Valid @RequestBody NewExecutionDto body) {
    executionModel.addExecution(body);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @Override
  @Secured({"ROLE_TEACHER"})
  public ResponseEntity<ExecutionDto> executionIdGet(@PathVariable("id") Integer id) {
    return executionModel
        .getExecution(id.longValue())
        .map(e -> new ResponseEntity<>(e, HttpStatus.OK))
        .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @Override
  @Secured({"ROLE_TEACHER"})
  public ResponseEntity<Resource> executionIdPrintGet(@Valid @PathVariable("id") Integer id) {
    return qrModel
        .generatePdf(id)
        .map(b -> new ResponseEntity<Resource>(new ByteArrayResource(b), HttpStatus.OK))
        .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @Override
  public ResponseEntity<Page<ExecutionDto>> executionGet(
      @Valid @RequestParam(value = "page", defaultValue = "0") int page,
      @Valid @RequestParam(value = "limit", defaultValue = "5") int limit,
      @Valid @RequestParam(value = "sort", defaultValue = "name") String sortOptions) {
    return new ResponseEntity<>(
        executionModel.pageExecution(page, limit, SortParameterHandler.makeSort(sortOptions)),
        HttpStatus.OK);
  }
}
