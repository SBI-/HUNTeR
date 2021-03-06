package ch.japt.epj.api.controller;

import ch.japt.epj.api.ExerciseApi;
import ch.japt.epj.api.PaginatedExercise;
import ch.japt.epj.library.SortParameterHandler;
import ch.japt.epj.model.ExerciseModel;
import ch.japt.epj.model.dto.ExerciseDto;
import ch.japt.epj.model.dto.NewExerciseDto;
import io.swagger.annotations.Api;
import java.util.List;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Api(tags = "Exercise API")
@RequestMapping("/api")
public class ExerciseController implements ExerciseApi, PaginatedExercise {
  private final ExerciseModel exerciseModel;

  public ExerciseController(@Autowired ExerciseModel exerciseModel) {
    this.exerciseModel = exerciseModel;
  }

  @Override
  @Secured({"ROLE_TEACHER"})
  public ResponseEntity<Void> addExercise(@Validated @RequestBody NewExerciseDto body) {
    exerciseModel.addExercise(body);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @Override
  public ResponseEntity<List<NewExerciseDto>> exerciseIdGet(@PathVariable("id") List<Integer> id) {
    return new ResponseEntity<>(exerciseModel.getExercises(id), HttpStatus.OK);
  }

  @Override
  @Secured({"ROLE_TEACHER"})
  public ResponseEntity<List<NewExerciseDto>> exerciseTeacherIdGet(
      @PathVariable("id") List<Integer> id) {
    return new ResponseEntity<>(exerciseModel.getExercisesForTeacher(id), HttpStatus.OK);
  }

  @Override
  @Secured({"ROLE_TEACHER"})
  public ResponseEntity<Page<ExerciseDto>> exerciseGet(
      @Valid @RequestParam(value = "page", defaultValue = "0") int page,
      @Valid @RequestParam(value = "limit", defaultValue = "5") int limit,
      @Valid @RequestParam(value = "sort", defaultValue = "name") String sortOptions) {
    return new ResponseEntity<>(
        exerciseModel.pageExercise(page, limit, SortParameterHandler.makeSort(sortOptions)),
        HttpStatus.OK);
  }
}
